% clear; clc; close all;
% 
% L = 1;
% Nx = 100;
% x = linspace(0, L, Nx);
% 
% Bi_list = [0.1, 5, 10];
% time_points = [linspace(0.01, 0.2, 10), 0.4, 0.6, 0.8, 1.0];
% modes_list = [1, 2, 3, 10];
% mode_labels = {'Mode 1', 'Modes 1-2', 'Modes 1-3', 'Modes 1-10'};
% 
% output_folder = 'fourier_modes';
% if ~exist(output_folder, 'dir')
%     mkdir(output_folder);
% end
% 
% colors = lines(length(modes_list));
% 
% for bi_idx = 1:length(Bi_list)
%     Bi = Bi_list(bi_idx);
% 
%     for t_idx = 1:length(time_points)
%         t = time_points(t_idx);
% 
%         for m_idx = 1:length(modes_list)
%             n_terms = modes_list(m_idx);
%             theta = zeros(size(x));
% 
%             % Sum from 1 to n_terms
%             for n = 1:n_terms
%                 lambda_n = (2*n - 1)*pi/2;
%                 Bn = 4 / (pi * (2*n - 1));
%                 theta = theta + Bn * cos(lambda_n * x) .* exp(-lambda_n^2 * t);
%             end
% 
%             % --- Plot individual mode sum ---
%             fig = figure('Visible','off');
%             plot(x, theta, '-', 'Color', colors(m_idx,:), 'LineWidth', 2.5);
%             title(sprintf('\\theta(x,t), t=%.3f, Bi=%.1f, %s', t, Bi, mode_labels{m_idx}), ...
%                   'FontSize', 14, 'FontWeight', 'bold');
%             xlabel('x (non-dimensional)', 'FontSize', 12);
%             ylabel('\theta(x,t)', 'FontSize', 12);
%             ylim([0 1.05]); grid on; box on;
%             set(gca, 'FontSize', 12);
%             set(gcf, 'Position', [100 100 700 500]);
% 
%             % Save
%             safe_label = strrep(mode_labels{m_idx}, ' ', '');
%             filename = sprintf('cooling_t%.3f_%s_Bi%.1f.png', t, safe_label, Bi);
%             saveas(fig, fullfile(output_folder, filename));
%             close(fig);
%         end
% 
%         % --- Oscillation Plot: Individual Modes Without Sum ---
%         fig = figure('Visible','off');
%         hold on;
%         n_show = 3;  % number of modes to plot individually
%         for n = 1:n_show
%             lambda_n = (2*n - 1)*pi/2;
%             Bn = 4 / (pi * (2*n - 1));
%             theta_n = Bn * cos(lambda_n * x) .* exp(-lambda_n^2 * t);
%             plot(x, theta_n, 'LineWidth', 2.0, 'DisplayName', sprintf('n = %d', n));
%         end
%         title(sprintf('Individual Mode Contributions at t = %.3f, Bi = %.1f', t, Bi), ...
%               'FontSize', 14, 'FontWeight', 'bold');
%         xlabel('x (non-dimensional)', 'FontSize', 12);
%         ylabel('\theta_n(x,t)', 'FontSize', 12);
%         ylim([-1 1]); grid on; box on;
%         legend('Location', 'northeast', 'FontSize', 11);
%         set(gca, 'FontSize', 12);
%         set(gcf, 'Position', [100 100 700 500]);
% 
%         filename = sprintf('cooling_t%.3f_modes_oscillation_Bi%.1f.png', t, Bi);
%         saveas(fig, fullfile(output_folder, filename));
%         close(fig);
%     end
% end
% 


%% Bi incorporated


clear; clc; close all;

L = 1;
Nx = 100;
x = linspace(0, L, Nx);

Bi_list = [0.1, 5, 10];
time_points = [linspace(0.01, 0.2, 10), 0.4, 0.6, 0.8, 1.0];
modes_list = [1, 2, 3, 10];
mode_labels = {'Mode 1', 'Modes 1-2', 'Modes 1-3', 'Modes 1-10'};

output_folder = 'fourier_modes_with_bi';
if ~exist(output_folder, 'dir')
    mkdir(output_folder);
end

colors = lines(length(modes_list));

% ---------------------------
% Function to find eigenvalues for given Bi
% ---------------------------
function lambda_list = get_lambda(Bi, N)
    lambda_list = zeros(1, N);
    found = 0;
    l_start = 0.01;
    l_end = 30;
    dx = 0.01;
    x_scan = l_start:dx:l_end;
    f = @(l) l .* tan(l) - Bi;

    for i = 1:length(x_scan)-1
        a = x_scan(i);
        b = x_scan(i+1);
        if f(a)*f(b) < 0  % sign change ⇒ root exists
            root = fzero(f, [a, b]);
            found = found + 1;
            lambda_list(found) = root;
            if found == N
                return;
            end
        end
    end

    if found < N
        error('Only found %d eigenvalues (needed %d). Try increasing scan range.', found, N);
    end
end

for bi_idx = 1:length(Bi_list)
    Bi = Bi_list(bi_idx);

    for t_idx = 1:length(time_points)
        t = time_points(t_idx);

        % Get eigenvalues once for all modes up to max
        max_n = max(modes_list);
        lambda_n = get_lambda(Bi, max_n);

        for m_idx = 1:length(modes_list)
            n_terms = modes_list(m_idx);
            theta = zeros(size(x));

            % Sum up to n_terms
            for n = 1:n_terms
                lam = lambda_n(n);
                Bn = (4 * sin(lam)) / (2 * lam + sin(2 * lam));
                theta = theta + Bn * cos(lam * x) .* exp(-lam^2 * t);
            end

            % --- Main Fourier mode sum plot ---
            fig = figure('Visible','off');
            plot(x, theta, '-', 'Color', colors(m_idx,:), 'LineWidth', 2.5);
            title(sprintf('\\theta(x,t), t=%.3f, Bi=%.1f, %s', t, Bi, mode_labels{m_idx}), ...
                  'FontSize', 14, 'FontWeight', 'bold');
            xlabel('x (non-dimensional)', 'FontSize', 12);
            ylabel('\theta(x,t)', 'FontSize', 12);
            ylim([0 1.05]); grid on; box on;
            set(gca, 'FontSize', 12);
            set(gcf, 'Position', [100 100 700 500]);

            % Save
            safe_label = strrep(mode_labels{m_idx}, ' ', '');
            filename = sprintf('cooling_t%.3f_%s_Bi%.1f.png', t, safe_label, Bi);
            saveas(fig, fullfile(output_folder, filename));
            close(fig);
        end

        % --- Oscillation Plot: Individual Modes Without Sum ---
        fig = figure('Visible','off');
        hold on;
        n_show = 3;  % number of modes to plot individually
        for n = 1:n_show
            lam = lambda_n(n);
            Bn = (4 * sin(lam)) / (2 * lam + sin(2 * lam));
            theta_n = Bn * cos(lam * x) .* exp(-lam^2 * t);
            plot(x, theta_n, 'LineWidth', 2.0, 'DisplayName', sprintf('n = %d', n));
        end
        title(sprintf('Individual Modes at t = %.3f, Bi = %.1f', t, Bi), ...
              'FontSize', 14, 'FontWeight', 'bold');
        xlabel('x (non-dimensional)', 'FontSize', 12);
        ylabel('\theta_n(x,t)', 'FontSize', 12);
        ylim([-1 1]); grid on; box on;
        legend('Location', 'northeast', 'FontSize', 11);
        set(gca, 'FontSize', 12);
        set(gcf, 'Position', [100 100 700 500]);

        filename = sprintf('cooling_t%.3f_modes_oscillation_Bi%.1f.png', t, Bi);
        saveas(fig, fullfile(output_folder, filename));
        close(fig);
    end
end
